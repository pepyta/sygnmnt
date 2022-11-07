int testFibonacci() {
    int ouput[] = { 1, 1, 2, 3, 5, 8, 13 };
    for(int i = 1; i <= 7; i++) {
        if(fibonacci(i) != ouput[i - 1]) {
            return 1;
        }
    }

    return 0;
}

int testPower() {
    int output[7] = { 1, 1, 9, 4, 0, 9, 8 };
    int input[7][2] = {
        {
            1, 1
        },
        {
            1, 9
        },
        {
            9, 1
        },
        {
            2, 2
        },
        {
            0, 3,
        },
        {
            3, 2
        },
        {
            2, 3
        }
    };

    for(int i = 0; i < sizeof(output) / sizeof(int); i++) {
        int base = input[i][0];
        int exp = input[i][1];
        int result = power(base, exp);

        if(result != output[i]) {
            return 1;
        }
    }

    return 0;
}

int main() {
    int fibonacciResult = testFibonacci();
    if(fibonacciResult != 0) return fibonacciResult;
    
    int powerResult = testPower();
    if(powerResult != 0) return powerResult;

    return 0;
}