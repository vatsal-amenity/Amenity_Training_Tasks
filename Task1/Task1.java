import java.util.Scanner;

public class Task1 {

    public static void FiboFunction(int n) {
        System.out.println("------------function based approach------------");
        
        long a = 0, b = 1;
        long startTime = System.nanoTime();
        long firstTerm = 0, secondTerm = 1;
        
        System.out.print("Series: ");
        for (int i = 2; i <= n; i++) {
            System.out.print(a + " , ");

            long next = a + b;
            a = b;
            b = next;
        }
        System.out.println(); 

        long endTime = System.nanoTime();
        long duration = (endTime - startTime); 

        System.out.println("Execution Time: " + duration + " nanoseconds");
    }

    static class fibo {
        
        public void exec(int n) {
            System.out.println("-------------------class based approach-------------------");
            
            long a = 0, b = 1;
            long startTime = System.nanoTime();

            long firstTerm = 0, secondTerm = 1;

            System.out.print("Series: ");
            for (int i = 2; i <= n; i++) {
                System.out.print(a + " , ");

                long next = a + b;
                a = b;
                b = next;
            }
            System.out.println();

            long endTime = System.nanoTime();
            long duration = (endTime - startTime);

            System.out.println("Execution Time: " + duration + " nanoseconds");
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter the num for fibbonaci : ");
        int count = sc.nextInt();

        //call function
        FiboFunction(count);

        //call class
        fibo cal = new fibo();
        cal.exec(count);

        sc.close();
    }
}