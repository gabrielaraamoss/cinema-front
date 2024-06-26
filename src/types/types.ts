export interface MovieDTO {
    id?: number; 
    name: string;
    genre: string;
    allowedAge: number;
    lengthMinutes: number;
}

export interface RoomDTO {
    id?: number; 
    name: string;
    number: number;
}
