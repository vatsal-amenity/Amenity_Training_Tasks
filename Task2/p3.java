public class p3{
    public static void printPattern3(int n){
        int i,j;
       for(i=n; i>=1; i--){

            for(j=1; j<i; j++){
            System.out.print(" ");
            }
            for(j=0; j<=n-i; j++){
                System.out.print("*");
            }
                System.out.println();     
       }
    }

    public static void main(String[] args){
        int n = 6;
        printPattern3(n);
    }
}

