import {useState} from 'react';
import {handleServerNetworkError} from '../utils/handleServerNetworkUtils';
import {useAppDispatch, useAppSelector} from './hooks';
import RNFS, {DocumentDirectoryPath} from 'react-native-fs';
import {offlineAPI} from '../api/offlineApi';
import {unzip} from 'react-native-zip-archive';
import {
  setdbModule,
  setdbModuleData,
  setdbNestedModuleData,
} from '../bll/reducers/local-reducer';
import {setArhiveLinks} from '../bll/reducers/app-reducer';
import {Platform} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';

export const useOfflineMode = () => {
  const dispatch = useAppDispatch();
  const [modelText, setModelText] = useState<string>();
  const [downloadProgress, setDownloadProgress] = useState(1);
  const {arhiveLinks} = useAppSelector(state => state.app);
  const {isConnected} = useNetInfo();

  const downloadNestedFile = async (el: any, model: string) => {
    if (!el.offlineId) {
      const nestedFilePath =
        RNFS.DocumentDirectoryPath + '/file' + `/${el?.key}`;

      const exists = await RNFS.exists(nestedFilePath);
      setModelText(`Downloading: ${el?.key}`);

      if (!exists) {
        await RNFS.downloadFile({
          fromUrl: el.url,
          toFile: nestedFilePath,
          background: true, // Enable downloading in the background (iOS only)
          discretionary: true, // Allow the OS to control the timing and speed (iOS only)
          progress: progr => {
            // Handle download progress updates if needed
            const progress = (progr.bytesWritten / progr.contentLength) * 100;
            setModelText(`Downloading: ${progress.toFixed(2)}% ${model}`);
          },
        })
          .promise.then(() => {
            dispatch(
              setdbNestedModuleData({
                model,
                id: el.id,
                data: {
                  ...el,
                  url:
                    Platform.OS === 'ios'
                      ? 'file://' + nestedFilePath
                      : nestedFilePath,
                },
              }),
            );
          })
          .catch(err => {
            console.log('Download error:', err);
          });
      } else {
        dispatch(
          setdbNestedModuleData({
            model,
            id: el.id,
            data: {
              ...el,
              url:
                Platform.OS === 'ios'
                  ? 'file://' + nestedFilePath
                  : nestedFilePath,
            },
          }),
        );
      }
    }
  };

  const readNestedFile = async (el: any, model: string) => {
    if (!el.offlineId) {
      const nestedFilePath =
        RNFS.DocumentDirectoryPath + '/file' + `/${el?.key}`;
      dispatch(
        setdbNestedModuleData({
          model,
          id: el.id,
          data: {
            ...el,
            url:
              Platform.OS === 'ios'
                ? 'file://' + nestedFilePath
                : nestedFilePath,
          },
        }),
      );
    }
  };

  const readFile = async (dirPath: string, model: string) => {
    const file = '/decrypted_data.json';

    setModelText(`Init: ${model}`);
    try {
      setModelText(`Init: ${model}`);
      const exists = await RNFS.exists(dirPath + file);

      if (exists) {
        const resultData = await RNFS.readFile(dirPath + file, 'utf8');
        const fileData = JSON.parse(resultData).payload;
        dispatch(setdbModuleData({model, data: fileData}));
        // model === 'asset' &&
        // console.log(model, JSON.stringify(fileData, null, 2));
        if (model === 'file' && isConnected) {
          const arr = Object.values(fileData);
          // arr.forEach(async el => await downloadNestedFile(el, model));

          for (const el of arr) {
            await downloadNestedFile(el, model);
          }
        } else if (model === 'file') {
          const arr = Object.values(fileData);

          // arr.forEach(async el => await readNestedFile(el, model));
          for (const el of arr) {
            await readNestedFile(el, model);
          }
        }
      }
      setModelText(undefined);
    } catch (err) {
      console.log('reed file error ===>', err);
    }
    setModelText(undefined);
  };

  const unzipArchive = async (model: string, name: string) => {
    const sourcePath = `${DocumentDirectoryPath}/${name}`;
    const targetPath = `${DocumentDirectoryPath}/${model}`;
    const charset = 'UTF-8';
    // charset possible values: UTF-8, GBK, US-ASCII and so on. If none was passed, default value is UTF-8

    unzip(sourcePath, targetPath, charset)
      .then(async path => {
        dispatch(setdbModule(model));
        await readFile(path, model);
      })
      .catch(error => {
        console.error('unzip error ===>', error);
      });
  };

  const downloadFiles = async () => {
    try {
      const res = await offlineAPI.getModels();

      for (let model of res.data.models) {
        const index = res.data.models.indexOf(model);
        setDownloadProgress(
          +(((index + 1) * 100) / res.data.models.length).toFixed(0),
        );
        if (model !== 'offlinemodel') {
          const resArhive = await offlineAPI.getArhive({
            modelName: model,
          });

          if (resArhive.data.file) {
            const {url, name} = resArhive.data.file;
            const dirPath = RNFS.DocumentDirectoryPath + '' + `/${model}`;
            const filePath = RNFS.DocumentDirectoryPath + '' + `/${name}`;

            if (
              !arhiveLinks[model] ||
              arhiveLinks[model].url !== url ||
              model === 'file'
            ) {
              // const exists = await RNFS.exists(filePath);
              // if (exists) {
              //   await RNFS.unlink(filePath);
              // }
              setModelText(`Downloading: ${model}`);
              await RNFS.downloadFile({
                fromUrl: url,
                toFile: filePath,
                background: true, // Enable downloading in the background (iOS only)
                discretionary: true, // Allow the OS to control the timing and speed (iOS only)
                progress: progr => {
                  // Handle download progress updates if needed
                  const progress =
                    (progr.bytesWritten / progr.contentLength) * 100;
                  setModelText(`Downloading: ${progress.toFixed(2)}% ${model}`);

                  // console.log(`Progress: ${progress.toFixed(2)}%`);
                },
              })
                .promise.then(async () => {
                  await unzipArchive(model, name);
                  dispatch(setArhiveLinks({model, url, name, dirPath}));
                })
                .catch(err => {
                  console.log('Download error:', err);
                });
            } else {
              await readFile(dirPath, model);
            }
          }
        }
      }
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
    setModelText(undefined);
  };

  return {downloadFiles, modelText, readFile, downloadProgress};
};
