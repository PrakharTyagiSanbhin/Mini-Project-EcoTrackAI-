#include <stdio.h>
int main() {
    int A[20], num, loc, n;
    printf("enter the number of elements of array: ");
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        printf("enter element %d: ", i + 1);
        scanf("%d", &A[i]);
    }
    printf("the array elements are: ");
    scanf("%d", &A[i]);
    for (int i = 0; i < n; i++) {
      A[i] = A[i];
    }
    printf("enter the location where you want to insert the element: ");
    scanf("%d", &loc);
    A[loc-1] = 10;
    printf("the updated array is: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", A[i]);
    }
    printf("\nenter the location where you want to insert the element: ");
    scanf("%d", &loc);
    A[loc-1] = 10;
    printf("the updated array is: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", A[i]);
    }
    return 0;
}