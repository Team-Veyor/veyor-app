/** 은행명 (예: "KB국민은행"). 계좌 등록 시 그대로 전송됩니다. */
export type Bank = string;

export type CreateAccountRequest = {
  bank: string;
  accountNo: string;
  holderName: string;
};

export type UpdateAccountRequest = Partial<CreateAccountRequest>;

export type Account = {
  id: string;
  bank: string;
  accountNoMasked: string;
  holderName: string;
  isPrimary: boolean;
};
