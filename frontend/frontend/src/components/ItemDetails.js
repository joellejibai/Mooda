const ItemDetails = ({ item }) => {

    return (
        <div className="Item-details">
            <h4>{item.category}</h4>
            <p><strong>Color: </strong>{item.color}</p>
            <p><strong>Brand: </strong>{item.brand}</p>
            <p><strong>Size: </strong>{item.size}</p>
            <p><strong>Material: </strong>{item.material}</p>
            <p><strong>Fit: </strong>{item.fit}</p>
            <p><strong>imageURL: </strong>{item.imageURL}</p>
            <p>{item.createdAt}</p>
        </div>
    )
}

export default ItemDetails