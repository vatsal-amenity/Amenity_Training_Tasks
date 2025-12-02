public class p4{
    public static void printPattern4(int n){
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
    }

    public static void main(String[] args){
        int n = 6;
        printPattern4(n);
    }
}

