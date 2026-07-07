const html = `
<script>
  window.ShopifyAnalytics = window.ShopifyAnalytics || {};
  window.ShopifyAnalytics.meta = window.ShopifyAnalytics.meta || {};
  window.ShopifyAnalytics.meta.currency = 'EUR';
  var meta = {"product":{"id":7157443919915,"gid":"gid:\/\/shopify\/Product\/7157443919915","vendor":"Airton","type":"Climatiseurs réversibles","handle":"climatiseur-reversible-fixe-mural-a","variants":[{"id":41373594124331,"price":59990,"name":"Climatiseur réversible A+++ - Pompe à chaleur Air Air (PAC) - 2500W","public_title":"2500W","sku":"409942"},{"id":41373594157099,"price":69990,"name":"Climatiseur réversible A+++ - Pompe à chaleur Air Air (PAC) - 3400W","public_title":"3400W","sku":"409943"}],"remote":false},"page":{"pageType":"product","resourceType":"product","resourceId":7157443919915,"requestId":"9d0fdf0f-a966-4360-b3ca-42534897b2f5-1783189804"}};
  for (var attr in meta) {
    window.ShopifyAnalytics.meta[attr] = meta[attr];
  }
</script>
`;
console.log('Test OK');
