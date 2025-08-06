import Button from '../components/Button/Button';
import Header from '../components/Layouts/Header';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-white">
      <Header />
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-4rem)]">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">HomePage</h1>
        <div className="flex gap-2 mt-10">
          <Button size="sm">Test 버튼</Button>
          <Button variant="secondary">Second </Button>
          <Button loading>로딩하는 버튼</Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
