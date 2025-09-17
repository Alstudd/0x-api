import { LimitOrder, LimitOrderFields } from '@0x/protocol-utils';
import { DataSource } from 'typeorm';

import { OrderWatcherSignedOrderEntity } from '../entities';
import { SignedLimitOrder } from '../types';
import { orderUtils } from './order_utils';
import { OrderWatcherInterface } from './order_watcher';

export class MockOrderWatcher implements OrderWatcherInterface {
    private readonly _connection: DataSource;

    constructor(connection: DataSource) {
        this._connection = connection;
    }

    public async postOrdersAsync(orders: SignedLimitOrder[]): Promise<void> {
        console.log(`📝 MockOrderWatcher: Storing ${orders.length} orders directly in database`);
        
        await this._connection.getRepository(OrderWatcherSignedOrderEntity).save(
            orders.map((order) => {
                const limitOrder = new LimitOrder(order as LimitOrderFields);
                return orderUtils.serializeOrder({
                    order,
                    metaData: {
                        orderHash: limitOrder.getHash(),
                        remainingFillableTakerAmount: order.takerAmount,
                    },
                });
            }),
        );
        
        console.log(`✅ MockOrderWatcher: Successfully stored ${orders.length} orders`);
    }
}
