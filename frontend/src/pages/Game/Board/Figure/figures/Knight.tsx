export const Knight = (props: any) => {
  const fill = props.fill || '#333333'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 280 280" fill={fill}>
      <path d="M127.355 35.5533C120.593 35.5533 122.139 49.3424 123.758 56.2369C121.931 61.4398 115.867 63.7418 112.343 66.4115C108.819 69.0813 111.916 73.0325 105.615 76.1293C99.3147 79.2262 92.587 84.886 80.5198 94.4971C68.4527 104.108 61.191 107.525 53.5022 108.486C47.3512 109.255 47.6644 113.933 48.5899 116.175L66.9576 136.679H75.1804C75.7143 133.689 79.3452 128.136 87.6747 126.961C96.0042 125.786 115.013 130.165 126.653 124.184C135.965 119.4 142.137 109.732 144.059 105.496L141.018 114.384C133.33 135.527 100.775 146.418 85.4586 149.221C79.9327 160.634 94.2572 183.756 102.11 193.891V197.48H183.291V194.187C194.658 182.82 201.129 158.627 202.944 147.952C203.355 158.504 196.005 179.796 192.278 189.123L217.631 197.597C232.719 174.562 239.479 135.921 219.553 97.0771C203.57 65.9192 171.1 56.1698 156.863 55.1898L156.132 59.2944C144.909 39.8699 132.271 35.3735 127.355 35.5533Z" fill={fill} stroke="black" strokeWidth="2" />
      <rect x="92.5272" y="198.078" width="97.3452" height="12.9595" fill={fill} stroke="black" strokeWidth="2" />
      <rect x="79.496" y="213.038" width="123.408" height="13.707" fill={fill} stroke="black" strokeWidth="2" />
      <rect x="71.1888" y="228.745" width="140.022" height="13.707" fill={fill} stroke="black" strokeWidth="2" />
    </svg>
  )
}
