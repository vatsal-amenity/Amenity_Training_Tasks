import java.util.*;

public class p5{
    public static void printPattern5(int n){
       int i,j;
       for(i=1; i<=n; i++){

        for(j=1; j<=n-i; j++){
            System.out.print(" ");
        }
        for(j=1; j<=(2*i)-1; j++){
            System.out.print("*");
        }
        System.out.println();
       }

       for(i=n; i>=1; i--){

        for(j=1; j<=n-i; j++){
            System.out.print(" ");
        }
        for(j=1; j<=(2*i)-1; j++){
            System.out.print("*");
        }
        System.out.println();
       }
    }

    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);
        
        System.out.println("Enter the number of row :");
        int n = sc.nextInt();
        printPattern5(n);
    }
}

