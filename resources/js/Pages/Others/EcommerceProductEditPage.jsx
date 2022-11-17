
import { useEffect } from 'react';
import { paramCase } from 'change-case';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { useSettingsContext } from '@/Components/settings';
// sections
import ProductNewEditForm from '@/sections/@dashboard/e-commerce/ProductNewEditForm';
import { Head } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function EcommerceProductEditPage () {
	const { themeStretch } = useSettingsContext();

	const dispatch = useDispatch();

	// const { name } = useParams();
	const name = "";

	const currentProduct = useSelector((state) =>
		state.product.products.find((product) => paramCase(product.name) === name)
	);

	useEffect(() => {
		dispatch(getProducts());
	}, [dispatch]);

	return (
		<>
			<Head>
				<title> Ecommerce: Edit product</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Edit product"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{
							name: 'E-Commerce',
							href: PATH_DASHBOARD.eCommerce.root,
						},
						{ name: currentProduct?.name },
					]}
				/>

				<ProductNewEditForm isEdit currentProduct={currentProduct} />
			</Container>
		</>
	);
}
