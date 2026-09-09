document.addEventListener('DOMContentLoaded',function(){
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('nav');
  if(toggle){
    toggle.addEventListener('click',()=>{
      if(nav.style.display === 'flex') nav.style.display = 'none';
      else nav.style.display = 'flex';
    });
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
      const href = this.getAttribute('href');
      if(href === '#') return;
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      // close mobile nav
      if(window.innerWidth <= 900) nav.style.display = 'none';
    })
  });

  // Demo CTA (placeholder)
  const demo = document.getElementById('open-demo');
  if(demo) demo.addEventListener('click',(e)=>{
    e.preventDefault();
    alert('Obrigado! Em um projeto real, aqui abriríamos um formulário de agendamento.');
  })
});
