import Button from '../components/Button/Button';
import ArtworkCard from '../components/ArtworkCard';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1>HomePage</h1>
      <div className="flex gap-2 mt-10">
        <Button size="sm">Test 버튼</Button>
        <Button variant="secondary">Second </Button>
        <Button loading>로딩하는 버튼</Button>
      </div>
      <div className="mt-16">
        <ArtworkCard
          imageUrl=""
          title="풍경"
          author="홍길동"
          likes={123}
          onClick={() => alert('작품 클릭!')}
        />
      </div>
    </div>
  );
};

export default HomePage;
