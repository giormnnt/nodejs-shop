const button = document.querySelector('.grid');

const deleteProduct = btn => {
  const productId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  fetch(`/admin/product-list/${productId}`, {
    method: 'DELETE',
    headers: { 'csrf-token': csrf },
  })
    .then(result => {
      console.log(result);
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
