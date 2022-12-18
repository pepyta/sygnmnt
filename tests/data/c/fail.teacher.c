int testFibonacci() {
    int ouput[] = { 1, 1, 2, 3, 5, 8, 13 };
    for(int i = 1; i <= 7; i++) {
        if(fibonacci(i) != ouput[i - 1]) {
            return 1;
        }
    }

    return 0;
}

int main() {
    int fibonacciResult = testFibonacci();
    if(fibonacciResult != 0) return fibonacciResult;
    
    return 0;
}