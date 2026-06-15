export interface BankMeta {
  value: string;
  label: string;
  icon: string;
}

const FALLBACK_ICON = '/dummy_bank.png';

const bankIcon = (file: string) => `/banks/${file}.svg`;

const BANK_LIST: Record<string, { label: string; icon?: string }> = {
  NH농협은행: { label: 'NH농협', icon: 'NH농협' },
  KB국민은행: { label: 'KB국민', icon: 'KB국민' },
  신한은행: { label: '신한', icon: '신한' },
  우리은행: { label: '우리', icon: '우리' },
  하나은행: { label: '하나', icon: '하나' },
  IBK기업은행: { label: 'IBK기업', icon: 'IBK기업' },
  카카오뱅크: { label: '카카오뱅크', icon: '카카오뱅크' },
  토스뱅크: { label: '토스뱅크', icon: '토스뱅크' },
  케이뱅크: { label: '케이뱅크', icon: '케이뱅크' },
  SC제일은행: { label: 'SC제일', icon: 'SC제일' },
  씨티은행: { label: '씨티', icon: '씨티' },
  부산은행: { label: '부산', icon: '부산' },
  'iM뱅크(대구)': { label: 'iM뱅크(대구)', icon: 'IM뱅크' },
  경남은행: { label: '경남', icon: '경남' },
  광주은행: { label: '광주', icon: '광주' },
  전북은행: { label: '전북', icon: '전북' },
  제주은행: { label: '제주', icon: '제주도' },
  새마을금고: { label: '새마을', icon: '새마을' },
  신협: { label: '신협', icon: '신협' },
  우체국: { label: '우체국', icon: '우체국' },
  수협은행: { label: '수협', icon: '수협' },
  KDB산업은행: { label: 'KDB산업', icon: 'KDB산업' },
  SBI저축은행: { label: 'sbi저축', icon: 'sbi저축' },
  저축은행: { label: '저축은행' },
  산림조합: { label: '산림조합' },
};

/**
 * API 은행명으로 표시용 메타를 조회합니다.
 * 매핑에 없는 은행명이 와도 은행명을 그대로 라벨로, fallback 아이콘을 써서 깨지지 않습니다.
 */
export const getBankMeta = (value: string): BankMeta => {
  const presentation = BANK_LIST[value];

  return {
    value,
    label: presentation?.label ?? value,
    icon: presentation?.icon ? bankIcon(presentation.icon) : FALLBACK_ICON,
  };
};
