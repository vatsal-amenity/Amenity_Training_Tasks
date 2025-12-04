function p3(n) {
    let i, j;

    for (i = n; i >= 1; i--) {

        for (j = 1; j < i; j++) {
            process.stdout.write(" ");
        }
        for (j = 0; j <= n - i; j++) {
            process.stdout.write("*");
        }

        console.log();
    }
}

let n = 6;
p3(n);