# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
# import scrapy
from itemadapter import ItemAdapter

# from scrapy.pipelines.images import ImagesPipeline
# from scrapy.exceptions import DropItem


class NobelLaureatesPipeline:
    def process_item(self, item, spider):
        return item


USA = [
    "US",
    "U.S.",
    "United States",
    "United States of America",
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
]
GERMANY = [
    "German Empire",
    "Imperial Germany",
    "German Empire",
]


class NobelItemPlaceOfBirthFix:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        if adapter.get("place_of_birth") in USA:
            adapter["place_of_birth"] = "USA"
        elif adapter.get("place_of_birth") == ["Republic of China"]:
            adapter["place_of_birth"] = "China"
        elif adapter.get("place_of_birth") in ["Russian Empire"]:
            adapter["place_of_birth"] = "Russian"
        elif adapter.get("place_of_birth") in GERMANY:
            adapter["place_of_birth"] = "Germany"
        elif adapter.get("place_of_birth") in ["Kingdom of Italy"]:
            adapter["place_of_birth"] = "Italy"
        elif adapter.get("place_of_birth") in ["British India"]:
            adapter["place_of_birth"] = "India"
        elif adapter.get("place_of_birth") in ["South Australia"]:
            adapter["place_of_birth"] = "Australia"
        elif adapter.get("place_of_birth") in ["French Empire", "Second French Empire"]:
            adapter["place_of_birth"] = "France"
        return item


class NobelItemPlaceOfDeathFix:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        if adapter.get("place_of_death") in USA:
            adapter["place_of_death"] = "USA"
        elif adapter.get("place_of_death") in ["Republic of China"]:
            adapter["place_of_death"] = "China"
        elif adapter.get("place_of_death") in ["Russian Empire"]:
            adapter["place_of_death"] = "Russian"
        elif adapter.get("place_of_death") in ["SFR Yugoslavia"]:
            adapter["place_of_death"] = "Yugoslavia"
        elif adapter.get("place_of_death") in GERMANY:
            adapter["place_of_death"] = "Germany"
        return item


class NobelItemCountryFix:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        if adapter.get("country") in "China (People's Republic of China)":
            adapter["country"] = "China"
        if adapter.get("country") in USA:
            adapter["country"] = "USA"
        return item
