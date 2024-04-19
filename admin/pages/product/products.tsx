import React, { useMemo, useState, useEffect } from 'react';
import { sub, format, isWithinInterval } from 'date-fns';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { FaPlusCircle, FaGripHorizontal, FaList } from 'react-icons/fa';
import { gql, useMutation } from '@apollo/client';
import { useAlert } from 'react-alert';

import TimePeriod from '../../components/controls/period';
import Search from '../../components/controls/search';
import Product from '../../components/products/Products/Product';

import styles from '../../styles/pages/products.module.scss';
import Table from '../../components/shared/Table';
import useAllProducts from '../../hooks/Products/useAllProducts';
import { PRODUCT_COLUMNS } from '../../data/ProductColumn';
import Link from 'next/link';
import fuzzyMatch from '../../helpers/fuzzySearch';
import Loader from '../../components/shared/Loader';

const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: String!) {
    deleteProductById(productId: $id)
  }
`;

const Products = () => {
  const alert = useAlert();

  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('grid');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [period, setPeriod] = useState(
    `${format(sub(new Date(), { months: 6 }), 'yyyy-MM-dd')} - ${format(
      new Date(),
      'yyyy-MM-dd',
    )}`,
  );
  const [selectionRange, setSelectionRange] = useState([
    {
      startDate: sub(new Date(), { months: 6 }),
      endDate: new Date(),
      key: 'Periods',
    },
  ]);

  const [deleteProduct, deleteState] = useMutation(DELETE_PRODUCT);

  const [products, setProducts] = useState<any[]>([]);
  const columns = useMemo(() => PRODUCT_COLUMNS, []);

  useEffect(() => {
    useAllProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);
  //
  const filterData = (rows, ids, query) => {
    const param = query.search.toLowerCase();
    const sortBy = query.sortBy;
    return rows
      .filter((row) => {
        // console.log(row.values);
        return (
          row.values?.productName.toLowerCase().includes(param)
          // &&
          // isWithinInterval(new Date(row.values?.createdAt), {
          //   start: query.range.startDate,
          //   end: query.range.endDate,
          // })
        );
      })
      .sort((firstEl, secondEl) => {
        if (firstEl.values[sortBy] < secondEl.values[sortBy]) return -1;
        if (firstEl.values[sortBy] > secondEl.values[sortBy]) return 1;
        return 0;
      });
  };
  //
  const caseInsensetiveSearch=(string,value)=>{
    return string.toLowerCase().includes(value.toLowerCase());
  }

  return (
    <div className="container-fluid center">
      {loading && <Loader />}
      <div className="row mb-30">
        <div className="col-6">
          <Search search={search} setSearch={setSearch} />
        </div>
        <div className="col-2">
          {/*<TimePeriod*/}
            {/*period={period}*/}
            {/*setPeriod={setPeriod}*/}
            {/*selectionRange={selectionRange}*/}
            {/*setSelectionRange={setSelectionRange}*/}
          {/*/>*/}
        </div>
      </div>
      <div className={styles.products__header}>
        <h2 className="heading-primary">{products.length} Results</h2>
        <div className={styles.products__viewWrapper}>
          <div className="sort-by">
            <span className="mr-10">Sort by</span>
            <select
              className="custom-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '1rem' }}
            >
              <option value="productName">Name</option>
              <option value="createdAt">Date</option>
              <option value="productCode">Stock Id</option>
              <option value="category">Category</option>
            </select>
          </div>
          <div className={styles.products__btnWrapper}>
            <button
              className={styles.products__view_btn}
              onClick={() => setViewType('grid')}
            >
              <FaGripHorizontal className="mr-10" />
              Card
            </button>
            <button
              className={styles.products__view_btn}
              onClick={() => setViewType('list')}
            >
              <FaList className="mr-10" />
              List
            </button>
          </div>
        </div>
        <div>
          <Link href="/product/add-new-product">
            <a className="btn-outline-green small mr-20">
              <FaPlusCircle className="btn-icon-small" />
              Add Product
            </a>
          </Link>
        </div>
      </div>
      <div className="row">
        {viewType === 'grid' ? (
          <>
            {products &&
              products
                .filter((product) => {
                  return (
                    caseInsensetiveSearch(product.productName, search)
                    // fuzzyMatch(product.productName, search) &&
                    // isWithinInterval(new Date(product.createdAt), {
                    //   start: selectionRange[0].startDate,
                    //   end: selectionRange[0].endDate,
                    // })
                  );
                })
                .reverse()
                .sort((firstEl, secondEl: any) => {
                  if (sortBy !== 'createdAt') {
                    if (firstEl[sortBy] < secondEl[sortBy]) return -1;
                    if (firstEl[sortBy] > secondEl[sortBy]) return 1;
                    return 0;
                  } else {
                    return (
                      // @ts-ignore
                      new Date(secondEl.createdAt) - new Date(firstEl.createdAt)
                    );
                  }
                })
                .map((product, idx) => (
                  <div
                    className="col-xxl-4 col-xl-6 col-xs-12"
                    key={product.id}
                  >
                    <Product
                      {...product}
                      deleteHandler={async () => {
                        const modifiedData = products.filter(
                          (p) => p.id !== product.id,
                        );
                        setProducts(modifiedData);

                        await deleteProduct({
                          variables: {
                            id: product.id,
                          },
                        });

                        if (!deleteState.error) {
                          alert.error('Deleted Product Successfully');
                        } else {
                          alert.error(deleteState.error.message);
                        }
                      }}
                    />
                  </div>
                ))}
          </>
        ) : (
          <Table
            filter={{ search, range: selectionRange[0], sortBy }}
            pageName="product"
            title="Products"
            columns={columns}
            data={products}
            globalFilterFn={filterData}
            deleteHandler={async (id, idx) => {
              const modifiedData = [...products];
              modifiedData.splice(idx, 1);
              setProducts(modifiedData);

              await deleteProduct({
                variables: {
                  id,
                },
              });

              if (!deleteState.error) {
                alert.info('Deleted Product Successfully');
              } else {
                alert.error(deleteState.error.message);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default Products;