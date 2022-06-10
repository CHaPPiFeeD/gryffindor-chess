/* eslint-disable max-len */
export const Queen = (props: any) => {
  const fill = props.fill || '#333333';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 281 280" fill="none">
      <rect x="98.8049" y="109.953" width="82.5286" height="3.36703" rx="1.68352" fill={fill} stroke="black" strokeWidth="2" />
      <path d="M102.464 194.539V190.516C111.976 179.559 117.735 165.253 117.735 149.604C117.735 136.827 113.896 124.944 107.308 115.049H172.831C166.243 124.944 162.404 136.827 162.404 149.604C162.404 165.253 168.162 179.559 177.675 190.516V194.539H102.464Z" fill={fill} stroke="black" strokeWidth="2" />
      <rect x="98.8049" y="115.049" width="82.5286" height="9.22081" rx="4.61041" fill={fill} stroke="black" strokeWidth="2" />
      <rect x="91.3965" y="196.539" width="97.3452" height="12.9595" fill={fill} stroke="black" strokeWidth="2" />
      <rect x="78.3652" y="211.498" width="123.408" height="13.707" fill={fill} stroke="black" strokeWidth="2" />
      <rect x="70.0581" y="227.205" width="140.022" height="13.707" fill={fill} stroke="black" strokeWidth="2" />
      <mask id="path-7-inside-1_3_1179" fill={fill}>
        <path fillRule="evenodd" clipRule="evenodd" d="M149.56 59.8502C151.915 57.4933 153.372 54.2382 153.372 50.6428C153.372 43.4492 147.54 37.6176 140.347 37.6176C133.153 37.6176 127.321 43.4492 127.321 50.6428C127.321 54.2382 128.778 57.4933 131.134 59.8502L118.474 74.8502L140.347 88.9813L162.219 74.8502L149.56 59.8502Z" />
      </mask>
      <path fillRule="evenodd" clipRule="evenodd" d="M149.56 59.8502C151.915 57.4933 153.372 54.2382 153.372 50.6428C153.372 43.4492 147.54 37.6176 140.347 37.6176C133.153 37.6176 127.321 43.4492 127.321 50.6428C127.321 54.2382 128.778 57.4933 131.134 59.8502L118.474 74.8502L140.347 88.9813L162.219 74.8502L149.56 59.8502Z" fill={fill} stroke="black" strokeWidth="2"/>
      <path d="M149.56 59.8502L148.145 58.4364L146.846 59.736L148.031 61.1401L149.56 59.8502ZM131.134 59.8502L132.662 61.1401L133.847 59.736L132.548 58.4364L131.134 59.8502ZM118.474 74.8502L116.946 73.5602L115.48 75.2969L117.389 76.5301L118.474 74.8502ZM140.347 88.9813L139.261 90.6612L140.347 91.3624L141.432 90.6612L140.347 88.9813ZM162.219 74.8502L163.305 76.5301L165.213 75.2969L163.748 73.5602L162.219 74.8502ZM151.372 50.6428C151.372 53.6867 150.141 56.4392 148.145 58.4364L150.974 61.264C153.689 58.5474 155.372 54.7897 155.372 50.6428H151.372ZM140.347 39.6176C146.436 39.6176 151.372 44.5537 151.372 50.6428H155.372C155.372 42.3446 148.645 35.6176 140.347 35.6176V39.6176ZM129.321 50.6428C129.321 44.5537 134.258 39.6176 140.347 39.6176V35.6176C132.049 35.6176 125.321 42.3446 125.321 50.6428H129.321ZM132.548 58.4364C130.552 56.4393 129.321 53.6867 129.321 50.6428H125.321C125.321 54.7897 127.004 58.5474 129.719 61.264L132.548 58.4364ZM129.605 58.5603L116.946 73.5602L120.003 76.1401L132.662 61.1401L129.605 58.5603ZM117.389 76.5301L139.261 90.6612L141.432 87.3014L119.559 73.1703L117.389 76.5301ZM141.432 90.6612L163.305 76.5301L161.134 73.1703L139.261 87.3014L141.432 90.6612ZM163.748 73.5602L151.088 58.5603L148.031 61.1401L160.691 76.1401L163.748 73.5602Z" fill={fill} mask="url(#path-7-inside-1_3_1179)" />
      <path d="M105.091 111.636C102.656 104.941 95.3969 89.5589 85.8356 81.5911C76.2742 73.6233 84.3969 71.7421 89.6535 71.7974C92.413 72.3771 99.1878 74.342 104.211 77.5639C107.409 79.6149 107.224 76.6451 107 73.0452C106.785 69.5768 106.532 65.5234 109.234 64.8123C114.694 63.3755 119.014 67.1625 126.715 73.9132L126.913 74.0862C130.944 77.6197 131.973 74.3049 133.23 70.2602C134.412 66.4538 135.795 62.001 140.069 62.001C144.344 62.001 145.727 66.4538 146.909 70.2602C148.165 74.3049 149.195 77.6197 153.226 74.0862L153.423 73.9132C161.124 67.1625 165.444 63.3755 170.904 64.8123C173.606 65.5234 173.354 69.5768 173.138 73.0452C172.914 76.6451 172.729 79.6149 175.927 77.5639C180.951 74.342 187.725 72.3771 190.485 71.7974C195.741 71.7421 203.864 73.6233 194.303 81.5911C184.741 89.5589 177.482 104.941 175.047 111.636H105.091Z" fill={fill} stroke="black" strokeWidth="2" />
    </svg>
  );
};
