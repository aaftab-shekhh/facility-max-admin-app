import * as yup from 'yup';
import {enumTypeWO} from '../enums/workOrders';

export const maxTitleCharacters = 100;
export const maxInstructionCharacters = 750;
export const maxDisctiptionCharacters = 500;
export const max50Characters = 50;
export const maxNoteCharacters = 500;

export const createWOSchema = yup.object().shape({
  title: yup
    .string()
    .max(maxTitleCharacters, `Maximum ${maxTitleCharacters} symbols allowed`)
    .required('This value can not be blank'),
  description: yup
    .string()
    .max(
      maxInstructionCharacters,
      `Maximum ${maxInstructionCharacters} symbols allowed`,
    ),
  frequency: yup.string().when('type', ([type], schema) => {
    if (type === enumTypeWO.RECURRING_MAINTENANCE) {
      return schema.required('Please select frequency');
    } else {
      return schema;
    }
  }),
  type: yup.string().required('Please select Type'),
  subType: yup
    .string()
    .when('type', ([type], schema) => {
      switch (type) {
        case enumTypeWO.RECURRING_MAINTENANCE:
          return schema.required('Please select SUB-Type');
        case enumTypeWO.SERVICE_REQUEST:
          return schema.required('Please select Service Type');
        case enumTypeWO.ACCESS_CONTROL:
          return schema.required('Please select Access Control');
        default:
          return schema;
      }
    })
    .nullable(),
  priority: yup.string().required('Please select Priority'),
  startDate: yup.string(),
  // .when('type', ([type], schema) => {
  //   if (type === 'Preventive Maintenance') {
  //     return schema.required('Please select Date');
  //   } else {
  //     return schema;
  //   }
  // }),
  startWorkOrder: yup.boolean(),
  expectedCompletionDate: yup
    .string()
    .when('startWorkOrder', ([startWorkOrder], schema) => {
      if (startWorkOrder) {
        return schema.required('This value can not be blank');
      }
      return schema;
    })
    .when('type', ([type], schema) => {
      if (type === enumTypeWO.RECURRING_MAINTENANCE) {
        return schema.optional();
      }
      return schema;
    }),
  estimatedLaborHoursTech: yup
    .string()
    .matches(/^(?=.*[0-9])/, 'Please enter a positive number')
    .when('startWorkOrder', ([startWorkOrder], schema) => {
      if (startWorkOrder) {
        return schema.required('This value can not be blank');
      }
      return schema;
    }),
  expectedDuration: yup
    .string()
    .matches(/^(?=.*[0-9])/, 'Please enter a positive number'),
  buildingId: yup.string().required('Please select Building'),
  // frequencyPM: yup.string().when('type', ([type], schema) => {
  //   if (type === 'Preventive Maintenance') {
  //     return schema.required('Please select Frequency');
  //   } else {
  //     return schema;
  //   }
  // }),
  specialInstructions: yup
    .string()
    .max(
      maxInstructionCharacters,
      `Maximum ${maxInstructionCharacters} symbols allowed`,
    ),
  isContractedPM: yup.boolean(),
  displayOnCalendars: yup.boolean(),
  roomId: yup
    .string()
    .when('type', ([type], schema) => {
      switch (type) {
        case enumTypeWO.AMENITY_SPACE_BOOKING:
          return schema.required('Please select Amenity Space');
        default:
          return schema;
      }
    })
    .nullable(),
  // bucketsId: yup
  //   .array()
  //   .min(1, 'Please select Team(s)')
  //   .required('Please select Team(s)'),
});

export const createWORequestorSchema = yup.object().shape({
  title: yup
    .string()
    .max(maxTitleCharacters, `Maximum ${maxTitleCharacters} symbols allowed`)
    .required('This value can not be blank'),
  type: yup.string().required('Please select Type'),
  priority: yup.string().required('Please select Priority'),
  subType: yup.string().when('type', ([type], schema) => {
    switch (type) {
      case enumTypeWO.SERVICE_REQUEST:
        return schema.required('Please select Service  Type');
      case enumTypeWO.ACCESS_CONTROL:
        return schema.required('Please select Access Control');
      default:
        return schema;
    }
  }),
  buildingId: yup.string().required('Please select Building'),
  specialInstructions: yup
    .string()
    .max(
      maxInstructionCharacters,
      `Maximum ${maxInstructionCharacters} symbols allowed`,
    ),
  description: yup
    .string()
    .max(
      maxInstructionCharacters,
      `Maximum ${maxInstructionCharacters} symbols allowed`,
    ),
});

export const createAssetSchema = yup.object().shape({
  name: yup
    .string()
    .max(max50Characters, `Maximum ${max50Characters} symbols allowed`)
    .required('This value can not be blank'),
  buildingId: yup.string().required('Please select Building'),
  categoryId: yup.string().required('Please select Category'),
  typeId: yup.string().required('Please select Type'),
  model: yup
    .string()
    .max(max50Characters, `Maximum ${max50Characters} symbols allowed`)
    .optional(),
  serialNumber: yup
    .string()
    .max(max50Characters, `Maximum ${max50Characters} symbols allowed`)
    .required('This value can not be blank'),
  manufacturer: yup
    .string()
    .max(max50Characters, `Maximum ${max50Characters} symbols allowed`)
    .optional(),
  installDate: yup.string().optional(),
  laborValue: yup.number().optional(),
  cost: yup.number().optional(),
  equipmentId: yup.string().max(12, `Maximum ${12} symbols allowed`).optional(),
});

export const editAssetSchema = yup.object().shape({
  name: yup
    .string()
    .max(max50Characters, `Maximum ${max50Characters} symbols allowed`)
    .required('This value can not be blank'),
  categoryId: yup.string().required('Please select Category'),
  typeId: yup.string().required('Please select Type'),
  laborValue: yup.number().optional(),
  cost: yup.number().optional(),
  model: yup
    .string()
    .max(max50Characters, `Maximum ${max50Characters} symbols allowed`)
    .optional(),
  serialNumber: yup
    .string()
    .max(max50Characters, `Maximum ${max50Characters} symbols allowed`)
    .required('This value can not be blank'),
  manufacturer: yup
    .string()
    .max(max50Characters, `Maximum ${max50Characters} symbols allowed`)
    .optional(),
  installDate: yup.string().optional(),
  equipmentId: yup.string().max(12, `Maximum ${12} symbols allowed`).optional(),
});

export const createSubcontractorSchema = yup.object().shape({
  name: yup
    .string()
    .max(max50Characters, `Maximum ${max50Characters} symbols allowed`)
    .required('This value can not be blank'),
  // companyName: yup
  //   .string()
  //   .max(max50Characters, `Maximum ${max50Characters} symbols allowed`)
  //   .required('Required'),
  assetCategoriesId: yup
    .array()
    .min(1, 'Required')
    .required('This value can not be blank'),
  address: yup
    .string()
    .max(maxTitleCharacters, `Maximum ${maxTitleCharacters} symbols allowed`)
    .required('This value can not be blank'),
  city: yup
    .string()
    .max(max50Characters, `Maximum ${max50Characters} symbols allowed`)
    .required('This value can not be blank'),
  zipCode: yup
    .string()
    .max(max50Characters, `Maximum ${max50Characters} symbols allowed`)
    .required('This value can not be blank'),
  state: yup
    .string()
    .max(max50Characters, `Maximum ${max50Characters} symbols allowed`)
    .required('This value can not be blank'),
  hoursOfOperation: yup
    .string()
    .matches(/^(?=.*[0-9])/, 'Please enter a positive number'),
  phone: yup
    .string()
    .min(17, 'Please use at least 11 characters')
    .required('This value can not be blank'),
  afterHoursPhone: yup.string().min(17, 'Please use at least 11 characters'),
  // regionId: yup.string().required('Please select region'),
  noteText: yup
    .string()
    .max(
      maxInstructionCharacters,
      `Maximum ${maxInstructionCharacters} symbols allowed`,
    ),
});

export const reportValidationsSchema = yup.object().shape({
  title: yup
    .string()
    .max(max50Characters, `Maximum ${max50Characters} symbols allowed`)
    .required('This value can not be blank'),

  description: yup
    .string()
    .max(
      maxDisctiptionCharacters,
      `Maximum ${maxDisctiptionCharacters} symbols allowed`,
    )
    .required('This value can not be blank'),
});
export const validationsNoteSchema = yup.object().shape({
  description: yup
    .string()
    .max(maxNoteCharacters, `Maximum ${maxNoteCharacters} symbols allowed`),
});
