import math
import numpy


class MatrixFactorization:

    def __init__(self, X):
        self.X = numpy.array(X)
        
        N = len(X)
        M = len(X[0])

        self.K = 6

        self.V = numpy.random.rand(N, self.K)
        self.F = numpy.random.rand(self.K, M)


        self.learning_rate = 0.001

        self.S = []
        self.rmse = []


    def calc_S(self):
        for i in range(len(self.X)):
            for j in range(len(self.X[i])):
                if self.X[i][j]["count"] > 0:
                    self.S.append(self.X[i][j]["count"])


    def calc_RMSE(self, iteration):

        self.rmse.append(0)
        for i in range(len(self.X)):
            for j in range(len(self.X[i])):
                if (self.X[i][j])["count"] > 0:
                    x = 0

                    for k in range(self.K):
                        x += self.V[i,k] * self.F[k, j]            

                    self.rmse[iteration] += numpy.around(pow(self.X[i][j]["count"] - x, 2) / len(self.S), decimals=4)


        self.rmse[iteration] += numpy.around(math.sqrt(self.rmse[iteration]), decimals=4)

        if iteration > 1:
            if self.rmse[iteration - 2] <= self.rmse[iteration - 1] and self.rmse[iteration - 1] <= self.rmse[iteration] and self.rmse[iteration - 2] <= self.rmse[iteration]:
                return False

        return True


    def begin(self):

        self.calc_S()
        iteration = 0

        while True:

            for i in range(len(self.X)):
                for j in range(len(self.X[i])):
                    if self.X[i][j]["count"] > 0:
                        x = 0
                        for k in range(self.K):
                            x += self.V[i,k] * self.F[k, j] 

                        eij = self.X[i][j]["count"] - x

                        for k in range(self.K):
                            e_1 = - 2 * eij * self.F[k][j]
                            e_2 = - 2 * eij * self.V[i][k]
                            self.V[i][k] = self.V[i][k] + self.learning_rate * (-e_1) 
                            self.F[k][j] = self.F[k][j] + self.learning_rate * (-e_2)


            if not self.calc_RMSE(iteration):
                break

            iteration += 1
            
        mult_array = numpy.matmul(self.V, self.F)
        
        for i in range(len(mult_array)):
            for j in range(len(mult_array[i])):
                self.X[i][j]['recommendation'] = mult_array[i][j]
        
        return self.X
