module.exports = {
  content: [
    './public/index.html',
    './public/homepageApp.js',
    './public/leaderboards.html',
    './public/leaderboardsApp.js',
    './public/playerProfile.html',
    './public/playerProfileApp.js',
    './public/gamePage.html',
    './public/gamePageApp.js',
    './public/login.html',
    './public/loginApp.js',
    './public/signUp.html',
    './public/signUpApp.js',
    './public/rulesPage.html',
    './public/rulesPageApp.js',
    './public/signUpSuccess.html',
    './public/passwordUpdated.html',
    './public/chessGame/classicChess/chessboard.html',
    './public/chessGame/classicChess/classicApp.js',
    './public/chessGame/cotlbChess/chessboardCOTLB.html',
    './public/chessGame/cotlbChess/chargeOfTheLightBrigade.js',
    './public/chessGame/kothChess/chessboardKOTH.html',
    './public/chessGame/kothChess/kingOfTheHill.js',
    './public/chessGame/replayChess/replayApp.js',
    './public/chessGame/replayChess/chessboardReplay.html',
    './public/chessGame/speedChess/chessboardSpeed.html',
    './public/chessGame/speedChess/speedApp.js'
  ],
  theme: {

    extend: {

      screens: {
        'header-sm': '690px',
        'timer-board-limit': '760px'

      },

      fontFamily: {
        'sans': ['Roboto','Arial', 'sans-serif'],
        'robot': 'Roboto',
        'noto': '"Noto Sans"',
        'menlo': 'Menlo',
        'times': 'Times New Roman',
        'arial': 'Arial',
        'helvetica' : '"Helvetica Neue"'
      },

      colors: {
        'burley-wood': '#DEB887',
        'chocolate': '#D2691E',
        'panel-background': '#FFFF99'
      },

      width: {
        '275': '68.75rem',
        '192': '48rem',
        '160': '40rem',
        '150': '37.5rem',
        '148': '37rem',
        '146': '36.5rem',
        '140': '35rem',
        '130.5': '32.625rem',
        '130': '32.5rem',
        '127' : '31.75rem',
        '125': '31.25rem',
        '120': '30rem',
        '120.5':'30.125rem',
        '105': '26.25rem',
        '70': '17.5rem',
        '65': '16.25rem',
        '14.5': '3.625rem',
        '15': '3.75rem',
        '1/8': '12.5%',
        '3/8' : '37.5%',
        '9/10' : '90%',
        
      },

      borderWidth: {
        '5' : '5px'
      },

      minWidth: {
        '80' : '20rem',
        '88' : '22rem',
        '96' : '24rem',
        '100' : '25rem',
        '102' : '25.5rem',
        '104' : '26rem',
        '105' : '26.25rem',
        '120' : '30rem',
        '130' : '32.5rem',
        '140' : '35rem',
        '192' : '48rem'
      },

      minHeight: {
        '96' : '24rem',
        '140' : '35rem',
        '192' : '48rem'
      },

      margin: {
        '17.5': '4.375rem',
        '13.25': '3.3125rem',
        '10.8': '2.7rem',
        '8.5': '2.125rem',
        '5.25': '1.3125rem',
        '61': '15.25rem',
      },

      height: {
        '200': '50rem',
        '160': '40rem',
        '152': '38rem',
        '140.5': '35.125rem',
        '132': '33rem',
        '130': '32.5rem',
        '125': '31.25rem',
        '124': '31rem',
        '123.5': '30.875rem',
        '123': '30.75rem',
        '120.5': '30.125rem',
        '120': '30rem',
        '114': '28.5rem',
        '110' : '27.5rem',
        '106': '26.5rem',
        '105': '26.25rem',
        '102.5': '25.625rem',
        '101.5': '25.375rem',
        '96.5': '24.125rem',
        '95.5': '23.875rem',
        '95': '23.75rem',
        '94.5': '23.625rem',
        '94': '23.5rem',
        '91.5': '22.875rem',
        '84' : '21rem',
        '82': '20.5rem',
        '65': '16.25rem',
        '61': '15.25rem',
        '19': '4.75rem',
        '18': '4.5rem',
        '17.5': '4.375rem',
        '17' : '4.25rem',
        '14.5': '3.625rem',
        '15': '3.75rem',
        '15.5': '3.875rem',
        '92.5': '23.125rem',
        '1/8': '12.5%',
        '4/7': '57%',

      }
    },
  },
  plugins: [],
}
