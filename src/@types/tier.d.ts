type Tier_List_Props = {
   TIER_LIST: {
      title: string,
      image?: StaticImport | string,
      icon?: string
      details: {
         price: string,
         daily_yield: string,
         duration: string,
         roi: string,
         purchase_limit: string
      }
   }
   handleBUY: (title: string) => void
   bg?: string
   btn_bg?: string
   iconColor?: string
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};