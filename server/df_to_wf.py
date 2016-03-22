import numpy as np


class Waterfall:
    def __init__(self, name, dataframe):
        self.name = name
        self.dataframe = dataframe.sum().to_frame().transpose()
        self.equation = []

    def plus(self, column):
        self.equation.append((column, self.dataframe[column][0]))
        return self

    def minus(self, column):
        self.equation.append((column, self.dataframe[column][0] * -1))
        return self

    def to_dict(self):
        equation_length = len(self.equation)
        waterfall_dict = dict(
            Net=[0] * (equation_length + 1),
            Positive=[0] * (equation_length + 1),
            Negative=[0] * (equation_length + 1),
            Calculated=[0] * (equation_length + 1),
            Labels=[0] * (equation_length + 1)
        )

        running_total = 0
        for i in range(equation_length):
            # populate positive and negative
            value = self.equation[i][1]
            pos_or_neg = 'Positive' if value >= 0 else 'Negative'
            waterfall_dict[pos_or_neg][i] = abs(value)

            # populate Calculated
            running_total += value
            waterfall_dict['Calculated'][i] = running_total if i > 0 else 0
            waterfall_dict['Labels'][i] = self.equation[i][0]

        waterfall_dict['Labels'][equation_length] = self.name
        waterfall_dict['Net'][equation_length] = waterfall_dict['Calculated'][equation_length - 1]
        return waterfall_dict
