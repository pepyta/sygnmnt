int fibonacci(int n) {
    if(n < 3) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int power(int base, int exp) {
    int result = 1;
    for(int i = 0; i < exp; i++) {
        result *= base;
    }

    return result;
}