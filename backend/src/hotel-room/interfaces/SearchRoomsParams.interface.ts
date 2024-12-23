  import { Types } from "mongoose";

  export interface SearchRoomsParams {
      limit: number;
      offset: number;
      hotel: Types.ObjectId ;
      isEnabled?: boolean;
    }