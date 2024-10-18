import pandas as pd
import sys
import random

countries_data = pd.read_csv('country-list.csv')
death_points = ['A', 'D', 'E', 'I', 'N', 'O', 'R', 'U', 'Y']

class AtlasGame:
    def __init__(self, data, death_points) -> None:
        self.data = data
        self.death_points = death_points
        self.game_on = True
        self.current_letter = random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    
    def oppn_turn(self, oppn):
        oppn = oppn.capitalize()

        if oppn in set(self.data['place']) and oppn[0] == self.current_letter:
            self.data = self.data[self.data['place'] != oppn]
            self.current_letter = oppn[-1].capitalize()
            return oppn, True
        else:
            return "Invalid Place or Wrong Starting Letter!", False
    
    def system_turn(self):
        available_places = self.data[self.data['Start'] == self.current_letter]

        if available_places.empty:
            return "You Won! No more places left!", False
        
        selected_place, self.game_on = self.select_strategic_game(available_places)
        if self.game_on:
            self.current_letter = selected_place[-1].capitalize()
        
        return selected_place, self.game_on
    
    def select_strategic_game(self, available_places):
        poss_end_lets = set()
        poss_end_places = []
        fut_end_lets = []
        temp_fut_end_lets = set()
        min_death_score = sys.maxsize
        fut_end_count = []
        best_next_words = []
        fut_move_counts = []

        for idx, row in available_places.itterrows():
            if row['Start'] == self.current_letter:
                poss_end_lets.add(row['End'])
                poss_end_places.append(row['places'])
        
        poss_end_list = list(poss_end_lets)

        for end_letter in poss_end_lets:
            for idx, row in self.data.iterrows():
                if row['Start'] == end_letter:
                    temp_fut_end_lets.add(row['End'])
            fut_end_lets.append(temp_fut_end_lets)
            temp_fut_end_lets = set()
        
        for sublist in fut_end_lets:
            if min_death_score != sys.maxsize:
                fut_end_count.append(min_death_score)
                min_death_score = sys.maxsize
            
            for future_end in sublist:
                if future_end in self.death_points:
                    if not (self.data['Start']  == future_end).value_counts().empty:
                        min_death_score = min(min_death_score, (self.data['Start'] == future_end.value_counts()[True]))
                        if future_end == poss_end_list[len(fut_end_count)]:
                            min_death_score -= 1
    
        fut_end_count.append(min_death_score)
        curr = max(fut_end_count)

        for index, value in enumerate(fut_end_count):
            if value == curr and  poss_end_list[index] in self.death_points:
                if not (self.data['Start'] == poss_end_list[index]).value_counts().empty:
                    fut_move_counts.append((self.data['Start'] == poss_end_list[index]).value_counts()[True])
                    best_next_words.append(poss_end_list[index])
        
        if best_next_words:
            best_next_word_strategy = max(best_next_words)
            best_next_word_index = best_next_words.index(best_next_word_strategy)

            for place in poss_end_places:
                if place[-1].capitalize() == best_next_words[best_next_word_index]:
                    self.data = self.data[self.data['place'] != place]
                    return best_next_words[best_next_word_index], True
        else:
            for index, value in enumerate(fut_end_count):
                if value == curr:
                    for place in poss_end_places:
                        if place[-1].capitalize() == poss_end_list[index]:
                            self.data = self.data[self.data['place'] != place]
                            return poss_end_list[index], True
        
        return ' ', False