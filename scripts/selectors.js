const SELECTORS = {
  aladin: {
    listItems: '.ss_book_box',
    publisher: '.ss_book_list ul li a[href*="Publisher"]',
    title: '.ss_book_list .bo3 b',
    author: '.ss_book_list ul li a[href*="AuthorSearch"]',
    container: '.ss_book_list'
  },
  yes24: {
    listItems: '#yesSchList > li, .goods_list .item, .gd_res, .cCont_goodsSet .item',
    publisher: '.goods_pub a, .authPub .pub a, .goods_info .goods_pub a, .goods_pub, .info_pub',
    title: '.gd_name',
    author: '.goods_auth a, .authPub .auth a, .goods_info .goods_auth a, .goods_auth, .info_auth',
    container: '.item_info'
  },
  kyobobook: {
    listItems: '.prod_item, li.item_bundle',
    // a태그를 명시적으로 지정하여 인라인 요소 뒤에 붙게 함
    publisher: '.prod_publish a, .prod_pub a, .type_pub a', 
    title: '.prod_name, .prod_info .prod_name',
    // 저자 역시 a태그 명시. .prod_author 내의 a태그들
    author: '.prod_author a, .type_author a, .author a', 
    container: '.prod_info_box'
  }
};

if (typeof module !== 'undefined') {
  module.exports = SELECTORS;
}