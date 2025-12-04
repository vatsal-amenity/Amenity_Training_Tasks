const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function p5(n) {
    let i, j;
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= n - i; j++) {
            process.stdout.write(" ");
        }
        for (j = 1; j <= (2 * i) - 1; j++) {
            process.stdout.write("*");
        }
        
        console.log(); 
    }
    for (i = n; i >= 1; i--) {
        for (j = 1; j <= n - i; j++) {
            process.stdout.write(" ");
        }
        for (j = 1; j <= (2 * i) - 1; j++) {
            process.stdout.write("*");
        }
        console.log(); 
    }
}

rl.question("Enter the number of row : ", function(input) {
    let n = parseInt(input); 
    
    p5(n); 
    
    rl.close(); 
});