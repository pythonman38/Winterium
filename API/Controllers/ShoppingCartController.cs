using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ShoppingCartController : BaseApiController
    {
        private readonly IShoppingCartRepository _shoppingCartRepository;
        private readonly IMapper _mapper;
        public ShoppingCartController(IShoppingCartRepository shoppingCartRepository, IMapper mapper)
        {
            _mapper = mapper;
            _shoppingCartRepository = shoppingCartRepository;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerShoppingCart>> GetShoppingCartById(string id)
        {
            var shoppingCart = await _shoppingCartRepository.GetShoppingCartAsync(id);

            return Ok(shoppingCart ?? new CustomerShoppingCart(id));
        }

        [HttpPost]
        public async Task<ActionResult<CustomerShoppingCart>> UpdateShoppingCart(CustomerShoppingCartDto shoppingCart)
        {
            var customerShoppingCart = _mapper.Map<CustomerShoppingCartDto, CustomerShoppingCart>(shoppingCart);

            var updatedShoppingCart = await _shoppingCartRepository.UpdateShoppingCartAsync(customerShoppingCart);

            return Ok(updatedShoppingCart);
        }

        [HttpDelete]
        public async Task DeleteShoppingCartAsync(string id)
        {
            await _shoppingCartRepository.DeleteShoppingCartAsync(id);
        }
    }
}