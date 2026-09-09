import { PaymentMethod } from '../enums/payment-method.enum';

export interface PaymentCreate {
  paymentMethod: PaymentMethod;
}