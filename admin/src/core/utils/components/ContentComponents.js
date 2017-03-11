import React, {Component} from 'react';
import PageHeader from './ContentComponents/PageHeader/PageHeaderComponent';
import Loader from './ContentComponents/Loader/LoaderComponent';
import TabsForm from './ContentComponents/TabsForm/TabsFormComponent';
import Pagination from './ContentComponents/Pagination/PaginationComponent';
import Navigation from './ContentComponents/Navigation/NavigationComponent';
import Layout from '../../../Main/Layout/LayoutComponent';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';


// exports imported components
export {PageHeader, Loader, Layout, Link, TabsForm, toastr, Pagination, Navigation};
