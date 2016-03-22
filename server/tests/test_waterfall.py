import unittest
import pandas as pd
from server.df_to_wf import Waterfall
from expects import equal, expect, be_true


class TestWaterfall(unittest.TestCase):
    def test_Waterfall_can_add_column(self):
        df = pd.DataFrame({'Revenue': [200, 300], 'Cost': [100, 100]})
        profit = Waterfall('Profit', df).plus('Revenue')

        expect(profit.equation).to(equal([('Revenue', 500)]))

    def test_Waterfall_can_subtract_column(self):
        df = pd.DataFrame({'Revenue': [200, 300], 'Cost': [100, 100]})
        profit = Waterfall('Profit', df).plus('Revenue').minus('Cost')

        expect(profit.equation).to(equal([('Revenue', 500), ('Cost', -200)]))

    def test_Waterfall_makes_dictionary_output(self):
        df = pd.DataFrame({'Revenue': [200, 300], 'Cost': [100, 100], 'Interest': [10, 40]})
        profit = Waterfall('Profit', df).plus('Revenue').minus('Cost').minus('Interest')

        expect(profit.equation).to(equal(
            [('Revenue', 500), ('Cost', -200), ('Interest', -50)]
        ))

        Waterfall_dict = profit.to_dict()

        expect(Waterfall_dict).to(equal(
            dict(
                Net=[0, 0, 0, 250],
                Positive=[500, 0, 0, 0],
                Negative=[0, 200, 50, 0],
                Calculated=[0, 300, 250, 0],
                Labels=['Revenue','Cost','Interest','Profit']
            )))

