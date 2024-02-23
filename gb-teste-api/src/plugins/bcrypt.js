import bcrypt from "bcryptjs";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Digite a string que deseja converter para bcrypt: ', async (answer) => {
    const hash = await bcrypt.hash(answer, 10);  
    console.log(`A string ${answer} fora convertido para o bcrypt: ${hash}`);
    rl.close();
});