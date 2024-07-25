const ethers = require('ethers');
const nodemailer = require('nodemailer')
const addresses = {
  factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', 
  router: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d'
}

function init(url,mnemonic){

 const provider = new ethers.providers.WebSocketProvider(url);
//const provider = new ethers.providers.JsonRpcProvider(url);
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
return wallet.connect(provider);
}
async function send() {

  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  portconsole: 2525,
  auth: {
    user: "user1",
    pass: "pass"
  }
});

  let info = await transporter.sendMail({
   from: "admin@gmail.com",
    to: "test@gmail.com",// list of receivers
    subject: "Transaction passed", // Subject line
    html: "<b>transaction</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);

}

var a = async function swap(data,t1,t2,amount) {

  console.log("t1:",t1)
  console.log("t2:",t2)
  console.log("amount:",amount)
  amountIn = ethers.utils.parseUnits(amount)
  amountMin = ethers.utils.parseUnits(data.amount_min)

try{   

const  account = init(data.url,data.mnemonic)
const factory = new ethers.Contract(
  addresses.factory,
  ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
  account
);
const router = new ethers.Contract(
  addresses.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) returns (uint[] memory amounts)',
    'function _swap(uint[] memory amounts, address[] memory path, address _to)',
    'function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)',
    'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)returns (uint[] memory amounts)'
  ],
  account
);
 const token1 = new ethers.Contract(
  t1,
  [
    'function approve(address guy, uint wad) public returns (bool)',
    'function deposit() public payable'
  ],
  account
  );

const tx1 = await token1.approve(addresses.router, amountIn,{gasLimit: 100000})
await tx1.wait(1);
const tx2 = await token1.deposit({gasLimit: 100000,value:amountIn})
await tx2.wait(1);
factory.on('PairCreated', async (token0, token1, pairAddress) => {
  console.log(`
    New pair detected
    =================
    token0: ${token0}
    token1: ${token1}
    pairAddress: ${pairAddress}
  `);
if((token0 === t1) && (token1 === t2)) {
console.log("pair detected")
const tx = await router.swapExactTokensForTokens(
    amountIn,
    amountMin,
    [t1,t2],
    data.public_address,
    Date.now() + 1000 * 60 * 10,//10 minutes,
    {
      gasLimit: 7570361         
    }
  );
  const receipt = await tx.wait(1); 
  console.log('Transaction receipt');
  console.log(receipt);
  if(receipt) await send().catch(console.error);
  return receipt;
}
});

} catch(e){

  console.log("error",e);
}
}


module.exports.a = a;