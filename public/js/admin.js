const button = document.querySelector('.grid');

const deleteProduct = btn => {
  const productId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
  const productElement = btn.closest('article');

  fetch(`/admin/product-list/${productId}`, {
    method: 'DELETE',
    headers: { 'csrf-token': csrf },
  })
    .then(result => {
      return result.json();
    })
    .then(data => {
      console.log(data);
      productElement.parentNode.removeChild(productElement);
    })
    .catch(err => {
      console.log(err);
    });
};

button.addEventListener('click', function (e) {
  const btn = e.target.closest('.del');
  if (!btn) return;
  deleteProduct(btn);
});
