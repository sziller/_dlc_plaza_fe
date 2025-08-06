export interface DlcData {
  dlc_id: string;
  tmp_cntr_id: string;
  ini_email: string;
  ini_role: string;
  ini_pubkey: string;
  acc_email: string;
  acc_pubkey: string | null;
  orcl_id: string;
  cntr_terms: {
    payouts: {
      win: number;
      loss: number;
    };
    fee: number;
  };
  status: string;
  interest: number;
  ini_signatures: Record<string, any>;
  acc_signatures: Record<string, any>;
}

export interface DlcProps {
  // title: string;
  dlcs: DlcData[];
  textColor: string;
  statusLabel?: string;
  statusStyle?: string;

}
// This interface defines the structure of the response from the server
export interface UserDlcsResponse {
  timestamp: number;
  payload: DlcData[];
  message: string;
}

export interface DlcDetailsProps {
  timestamp: number; // Timestamp field
  message: string;   // Message field
  payload: {
      dlc_id: string;
      tmp_cntr_id: string;
      product_id: string;
      status: string;
      created_at: number;
      updated_at: number;
      offered_at: number | null;
      ini_role: string;
      ini_email?: string;
      acc_email?: string;
      interest: number;
      interest_ear: number;
      attest_at: number;
      refund_at: number;
      ini_collateral_sats: number;
      acc_collateral_sats: number;
      orcl_id: string;
      duration: number;
      cntr_terms: {
        rule: string | null;
      };
      ini_pubkey: string;
      ini_pubkey_funding: string | null;
      ini_payout_spk: string | null;
      ini_payout_ser_id: string | null;
      ini_change_spk: string | null;
      ini_change_ser_id: string | null;
      ini_fund_output_ser_id: string | null;
      ini_num_funding_inputs: number | null;
      feerate_per_vb: number | null;
      cet_locktime: number | null;
      refund_locktime: number | null;
  };
}

export interface DlcDetailsComponentProps {
  dlc: DlcDetailsProps['payload'];
  onClose: () => void;
  onWithdraw: () => void;
}