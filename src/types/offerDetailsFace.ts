import { OfferData } from '../types/offerFace';

export interface OfferDetailsProps {
  offer: OfferData;
  onClose: () => void;
  refreshOffers: () => void;
  setSelectedOffer: (offer: null) => void;
}
