import { useState, useCallback } from "react";
import Swal from "sweetalert2";

export const useOrderManagement = (initialProducts = []) => {
    const [productsInOrder, setProductsInOrder] = useState(initialProducts);

    const addNewProduct = useCallback(
        (products) => {
            const availableProducts = products.filter(
                (prod) =>
                    !productsInOrder.some(
                        (p) => p.produto_id === prod.produto_id
                    )
            );

            if (availableProducts.length === 0) {
                Swal.fire({
                    title: "Atenção!",
                    text: "Todos os produtos já foram adicionados ao pedido.",
                    icon: "info",
                    confirmButtonText: "Ok",
                });
                return;
            }

            setProductsInOrder((currentProductsInOrder) => [
                ...currentProductsInOrder,
                {
                    produto_id: availableProducts[0].produto_id,
                    qtd_produto_pedido: 1,
                },
            ]);
        },
        [productsInOrder]
    );

    const removeProduct = useCallback(
        (index) => {
            const updatedProducts = productsInOrder.filter(
                (_, i) => i !== index
            );
            setProductsInOrder(updatedProducts);
        },
        [productsInOrder]
    );

    const updateProductDetails = useCallback((products, index, field, value) => {
            if (field === "produto_id") {
                if (
                    productsInOrder.some(
                        (p, i) => i !== index && p.produto_id === value
                    )
                ) {
                    Swal.fire({
                        title: "Erro!",
                        text: "Este produto já foi adicionado ao pedido. Selecione um produto diferente.",
                        icon: "error",
                        confirmButtonText: "Ok",
                    });
                    return;
                }
            }

            if (field === "qtd_produto_pedido") {
                const productDetails = products.find(
                    (p) => p.produto_id === productsInOrder[index].produto_id
                );
                if (productDetails && value > productDetails.qtd_estoque) {
                    Swal.fire({
                        title: "Erro!",
                        text: `A quantidade não pode exceder o estoque disponível. Estoque atual: ${productDetails.qtd_estoque}`,
                        icon: "error",
                        confirmButtonText: "Ok",
                    });
                    return;
                }
            }

            const updatedProducts = productsInOrder.map((product, i) =>
                i === index ? { ...product, [field]: value } : product
            );
            setProductsInOrder(updatedProducts);
        },
        [productsInOrder]
    );

    return {
        productsInOrder,
        setProductsInOrder,
        addNewProduct,
        removeProduct,
        updateProductDetails,
    };
};
