import { Player } from '@lottiefiles/react-lottie-player';

const LottieDisplay = ({ lottieFile }: { lottieFile: any }) => {
  return (
    <Player
      autoplay
      loop
      src={lottieFile}
      style={{ height: '360px', width: '360px' }}
    ></Player>
  );
};

export default LottieDisplay;
