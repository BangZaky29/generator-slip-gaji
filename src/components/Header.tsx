import logo from '../assets/NS_white_01.png';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo container */}
          <div className="w-12 h-12 flex items-center justify-center rounded-l shadow-[5px_5px_12px_rgba(0,0,0,0.11)] overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-contain"/>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Generator <span className="text-blue-600">SlipGaji</span>
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              Professional Salary Slip Generator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
