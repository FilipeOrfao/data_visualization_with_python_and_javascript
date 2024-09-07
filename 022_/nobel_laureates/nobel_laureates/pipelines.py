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


class NobelItemPlaceOfDeathFix:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        if adapter.get("place_of_death") in ["US", "U.S."]:
            adapter["place_of_death"] = "USA"
        elif adapter.get("place_of_death") in ["Republic of China"]:
            adapter["place_of_death"] = "China"
        elif adapter.get("place_of_death") in ["Russian Empire"]:
            adapter["place_of_death"] = "Russian"
        return item


class NobelItemPlaceOfBirthFix:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        if adapter.get("place_of_birth") in ["US", "U.S."]:
            adapter["place_of_birth"] = "USA"
        elif adapter.get("place_of_birth") == ["Republic of China"]:
            adapter["place_of_birth"] = "China"
        return item


class NobelItemCountryFix:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        if adapter.get("country") in "China (People's Republic of China)":
            adapter["country"] = "China"
        if adapter.get("country") in "United States":
            adapter["country"] = "USA"
        return item
