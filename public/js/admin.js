const button = document.querySelector('.grid');

const deleteProduct = btn => {
  const productId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
  console.log(productId, csrf);
};

button.addEventListener('click', function (e) {
  const btn = e.target.closest('.del');
  if (!btn) return;
  deleteProduct(btn);
});
