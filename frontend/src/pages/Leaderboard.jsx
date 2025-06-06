import React from 'react';

const Leaderboard = () => {
  const leaderboardData = [
    { rank: 1, name: 'Eiden', score: 2430, username: '@eiden', avatar: 'https://via.placeholder.com/100', change: 0 },
    { rank: 2, name: 'Jackson', score: 1847, username: '@jackson', avatar: 'https://via.placeholder.com/100', change: 0 },
    { rank: 3, name: 'Emma Aria', score: 1674, username: '@emma', avatar: 'https://via.placeholder.com/100', change: 0 },
    { rank: 4, name: 'Sebastian', score: 1124, username: '@sebastian', avatar: 'https://via.placeholder.com/100', change: 10 },
    { rank: 5, name: 'Jason', score: 875, username: '@jason', avatar: 'https://via.placeholder.com/100', change: -5 },
  ];

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-blue-900 to-blue-600 text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-center mb-8 tracking-wide text-yellow-400 drop-shadow-lg">🏆 Leaderboard 🏆</h1>
      
      {/* Podium */}
      <div className="flex justify-center items-end mb-12 space-x-8">
        {/* Second Place */}
        <div className="flex flex-col items-center transform translate-y-6 scale-95 hover:scale-100 transition duration-300">
          <img src={leaderboardData[1].avatar} alt={leaderboardData[1].name} className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-lg" />
          <p className="mt-3 text-lg font-semibold text-gray-200">{leaderboardData[1].name}</p>
          <p className="text-2xl font-bold text-gray-300">{leaderboardData[1].score}</p>
          <span className="text-3xl">🥈</span>
        </div>
        
        {/* First Place */}
        <div className="flex flex-col items-center transform scale-110 hover:scale-125 transition duration-300">
          <img src={leaderboardData[0].avatar} alt={leaderboardData[0].name} className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-2xl" />
          <p className="mt-3 text-lg font-semibold text-yellow-300">{leaderboardData[0].name}</p>
          <p className="text-3xl font-extrabold text-yellow-400">{leaderboardData[0].score}</p>
          <span className="text-3xl">👑</span>
        </div>
        
        {/* Third Place */}
        <div className="flex flex-col items-center transform translate-y-6 scale-95 hover:scale-100 transition duration-300">
          <img src={leaderboardData[2].avatar} alt={leaderboardData[2].name} className="w-24 h-24 rounded-full border-4 border-orange-400 shadow-lg" />
          <p className="mt-3 text-lg font-semibold text-orange-300">{leaderboardData[2].name}</p>
          <p className="text-2xl font-bold text-orange-400">{leaderboardData[2].score}</p>
          <span className="text-3xl">🥉</span>
        </div>
      </div>
      
      {/* Other Players */}
      <div className="grid gap-6 max-w-md w-full">
        {leaderboardData.slice(3).map((player) => (
          <div key={player.rank} className="flex items-center bg-white bg-opacity-20 backdrop-blur-md p-4 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <span className="w-10 text-center text-lg font-bold text-yellow-300">{player.rank}</span>
            <img src={player.avatar} alt={player.name} className="w-14 h-14 rounded-full mx-4 border-2 border-gray-400 shadow-md" />
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-100">{player.name}</p>
              <p className="text-gray-300 text-sm">{player.username}</p>
            </div>
            <p className="text-xl font-bold text-gray-200">{player.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;