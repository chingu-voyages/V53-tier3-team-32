import { Schema } from 'mongoose';

export interface IMenu {
    startDate: Date;
    endDate: Date;
    weeklyMenu: {
      day: string;
      dishes: string[];
      isDayOff: boolean;
    }[];
    createdBy: Schema.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
  }