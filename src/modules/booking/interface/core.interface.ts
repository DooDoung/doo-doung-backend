import { BookingStatus } from '@prisma/client';

export interface BookingEntity {
  id: string;
  customerId: string;
  courseId: string;
  prophetId: string;
  startDateTime: Date;
  endDateTime: Date;
  createdAt: Date;
  status: BookingStatus;
}

