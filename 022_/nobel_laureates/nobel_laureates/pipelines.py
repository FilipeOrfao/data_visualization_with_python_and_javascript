# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
# import scrapy
# from itemadapter import ItemAdapter
# from scrapy.pipelines.images import ImagesPipeline
# from scrapy.exceptions import DropItem


class NobelLaureatesPipeline:
    def process_item(self, item, spider):
        return item


# class NobelImagesPipeline(ImagesPipeline):
#     def get_media_requests(self, item, info):
#         print("hello there")
#         if item["profile_pic"]:
#             yield scrapy.Request(item["profile_pic"])

#     def item_completed(self, results, item, info):
#         image_paths = [img["path"] for ok, img in results if ok]
#         if not image_paths:
#             raise DropItem(item)
#         adapter = ItemAdapter(item)
#         adapter["bio_image"] = image_paths[0]
#         return item


# class NobelImagesPipeline(ImagesPipeline):
#     def get_media_requests(self, item, info):
#         print("hello there")
#         for image_url in item["image_urls"]:
#             yield scrapy.Request(image_url)

#     def item_completed(self, results, item, info):
#         image_paths = [img["path"] for ok, img in results if ok]
#         if not image_paths:
#             raise DropItem("Item contains no images")
#         adapter = ItemAdapter(item)
#         adapter["bio_image"] = image_paths[0]
#         return item
