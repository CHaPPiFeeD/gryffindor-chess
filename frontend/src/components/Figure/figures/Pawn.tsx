/* eslint-disable max-len */
export const Pawn = (props: any) => {
  const fill = props.fill || '#333333';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 281 280" fill="none">
      <path d="M169.417 81.1788C169.417 95.2127 156.654 106.775 140.669 106.775C124.684 106.775 111.922 95.2127 111.922 81.1788C111.922 67.145 124.684 55.583 140.669 55.583C156.654 55.583 169.417 67.145 169.417 81.1788Z" fill={fill} stroke="black" strokeWidth="2" />
      <path d="M103.064 177.044V173.021C112.576 162.064 118.335 147.758 118.335 132.109C118.335 119.332 114.496 107.449 107.908 97.5538H173.431C166.843 107.449 163.004 119.332 163.004 132.109C163.004 147.758 168.762 162.064 178.275 173.021V177.044H103.064Z" fill={fill} stroke="black" strokeWidth="2" />
      <rect x="99.4049" y="97.5538" width="82.5286" height="9.22081" rx="4.61041" fill={fill} stroke="black" strokeWidth="2" />
      <rect x="91.9965" y="179.044" width="97.3452" height="12.9595" fill={fill} stroke="black" strokeWidth="2" />
      <rect x="78.9652" y="194.003" width="123.408" height="13.707" fill={fill} stroke="black" strokeWidth="2" />
      <rect x="70.6581" y="209.71" width="140.022" height="13.707" fill={fill} stroke="black" strokeWidth="2" />
    </svg>
  );
};
