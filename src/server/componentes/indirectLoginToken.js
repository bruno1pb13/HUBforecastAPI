function generateToken() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    
    // Generate the 3 letters
    for (let i = 0; i < 3; i++) {
      token += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // Generate the 4 numbers
    for (let i = 0; i < 4; i++) {
      token += Math.floor(Math.random() * 10);
    }
    
    // Generate the 3 numbers
    for (let i = 0; i < 3; i++) {
      token += Math.floor(Math.random() * 10);
    }
    
    return token;
  }


  module.exports = {generateToken}